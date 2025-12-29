#!/bin/bash

# Script to copy Cognito users and groups from old staging to new staging environment
# Usage: ./copy-cognito-users.sh

set -e

# User Pool IDs
OLD_USER_POOL_ID="ap-southeast-2_aNghcOUvd"
NEW_USER_POOL_ID="ap-southeast-2_w14NIlIIp"

echo "Copying Cognito users from old pool ($OLD_USER_POOL_ID) to new pool ($NEW_USER_POOL_ID)"

# First, copy all groups from old pool
echo "Copying groups from old user pool..."

# Get all groups from old pool
aws cognito-idp list-groups --user-pool-id "$OLD_USER_POOL_ID" --output json > /tmp/old_groups.json

# Create each group in new pool
jq -r '.Groups[] | @base64' /tmp/old_groups.json | while read -r group_data; do
    group=$(echo "$group_data" | base64 --decode)
    
    group_name=$(echo "$group" | jq -r '.GroupName')
    description=$(echo "$group" | jq -r '.Description // ""')
    precedence=$(echo "$group" | jq -r '.Precedence // 1')
    
    echo "Creating group: $group_name"
    aws cognito-idp create-group \
        --group-name "$group_name" \
        --user-pool-id "$NEW_USER_POOL_ID" \
        --description "$description" \
        --precedence "$precedence" || echo "  Group $group_name already exists"
done

rm /tmp/old_groups.json

# Get all users from old pool
echo "Fetching users from old user pool..."
aws cognito-idp list-users --user-pool-id "$OLD_USER_POOL_ID" --output json > /tmp/old_users.json

# Process each user
jq -r '.Users[] | @base64' /tmp/old_users.json | while read -r user_data; do
    user=$(echo "$user_data" | base64 --decode)
    
    username=$(echo "$user" | jq -r '.Username')
    email=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="email") | .Value')
    name=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="name") | .Value // ""')
    email_verified=$(echo "$user" | jq -r '.Attributes[] | select(.Name=="email_verified") | .Value // "false"')
    
    echo "Processing user: $username ($email)"
    
    # Create user in new pool
    aws cognito-idp admin-create-user \
        --user-pool-id "$NEW_USER_POOL_ID" \
        --username "$email" \
        --user-attributes Name=email,Value="$email" Name=name,Value="$name" Name=email_verified,Value="$email_verified" \
        --message-action SUPPRESS \
        --temporary-password "TempPass123!" || echo "  User already exists"
    
    # Set permanent password (user will need to change it)
    aws cognito-idp admin-set-user-password \
        --user-pool-id "$NEW_USER_POOL_ID" \
        --username "$email" \
        --password "TempPass123!" \
        --permanent || echo "  Failed to set password"
    
    # Copy all group memberships from old pool
    old_groups=$(aws cognito-idp admin-list-groups-for-user \
        --user-pool-id "$OLD_USER_POOL_ID" \
        --username "$username" \
        --output json 2>/dev/null || echo '{"Groups":[]}')
    
    # Add user to each group they were in
    echo "$old_groups" | jq -r '.Groups[].GroupName' | while read -r group_name; do
        if [ -n "$group_name" ]; then
            echo "  Adding user to group: $group_name"
            aws cognito-idp admin-add-user-to-group \
                --user-pool-id "$NEW_USER_POOL_ID" \
                --username "$email" \
                --group-name "$group_name" || echo "  Failed to add to group $group_name"
        fi
    done
    
    echo "  Completed user: $email"
done

# Clean up
rm /tmp/old_users.json

echo ""
echo "Cognito user copy completed!"
echo "NOTE: All users have temporary password 'TempPass123!' and will need to reset it on first login."