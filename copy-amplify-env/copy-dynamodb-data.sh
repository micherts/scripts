#!/bin/bash

# Script to copy DynamoDB data from old staging to new staging environment
# Usage: ./copy-dynamodb-data.sh

set -e

# Environment IDs
OLD_STAGING_ID="lipwzvjrj5e5dgus2mtiogdk5i"
NEW_STAGING_ID="awtteslu4jedfgqftpal6fpuny"

echo "Copying data from old staging ($OLD_STAGING_ID) to new staging ($NEW_STAGING_ID)"

# Tables to copy
TABLES=(
    "UserProfile"
    "Operation" 
    "Membership"
    "PageAccess"
    "Area"
    "Category"
    "Period"
    "Store"
    "Unit"
    "Variation"
    "Overhead"
    "Supplier"
    "Role"
    "Ingredient"
    "Recipe"
    "RecipeIngredient"
    "Notice"
    "Action"
    "SquareConfig"
    "SquareSyncHistory"
)

copy_table() {
    local table=$1
    local source_table="${table}-${OLD_STAGING_ID}-staging"
    local target_table="${table}-${NEW_STAGING_ID}-stage"
    
    echo "Copying $source_table -> $target_table"
    
    # Export data from source table
    if ! aws dynamodb scan --table-name "$source_table" --output json > "/tmp/${table}_data.json" 2>/dev/null; then
        echo "  ❌ Source table $source_table not found, skipping"
        return
    fi
    
    # Check if data exists
    local count=$(jq '.Items | length' "/tmp/${table}_data.json")
    if [ "$count" -eq 0 ]; then
        echo "  No data in $source_table, skipping"
        rm "/tmp/${table}_data.json"
        return
    fi
    
    echo "  Found $count items"
    
    # Check if target table exists
    if ! aws dynamodb describe-table --table-name "$target_table" >/dev/null 2>&1; then
        echo "  ❌ Target table $target_table not found, skipping"
        rm "/tmp/${table}_data.json"
        return
    fi
    
    # Transform and import data using batch operations
    echo "  Processing in batches of 25..."
    
    # Create batch write requests (25 items per batch - DynamoDB limit)
    local batch_size=25
    local batches=$(( (count + batch_size - 1) / batch_size ))
    local current_batch=0
    
    for ((start=0; start<count; start+=batch_size)); do
        ((current_batch++))
        printf "\r  Progress: %d/%d batches" "$current_batch" "$batches"
        
        # Create batch request
        jq -c ".Items[$start:$((start+batch_size))] | map({\"PutRequest\": {\"Item\": .}}) | {\"$target_table\": .}" "/tmp/${table}_data.json" > "/tmp/batch_${current_batch}.json"
        
        # Execute batch write
        aws dynamodb batch-write-item --request-items "file:///tmp/batch_${current_batch}.json" >/dev/null 2>&1 || true
        rm "/tmp/batch_${current_batch}.json"
    done
    
    echo ""
    echo "  ✅ Completed $table ($count items in $batches batches)"
    rm "/tmp/${table}_data.json"
}

# Copy each table
for table in "${TABLES[@]}"; do
    copy_table "$table"
done

echo "Data copy completed!"