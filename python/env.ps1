$env = 
[PSCustomObject]@{
    staging = @(
        [PSCustomObject]@{
            tn    = 'Area-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Area-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-09-30T13:10:26.786'
        },
        [PSCustomObject]@{
            tn    = 'Category-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Category-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-09-30T13:12:24.818'
        },
        [PSCustomObject]@{
            tn    = 'Period-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Period-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:22:06.156'
        },
        [PSCustomObject]@{
            tn    = 'Store-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Store-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:23:27.464'
        },
        [PSCustomObject]@{
            tn    = 'Unit-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Unit-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:23:27.353'
        },
        [PSCustomObject]@{
            tn    = 'Operation-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Operation-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:23:26.205'
        },
        [PSCustomObject]@{
            tn    = 'Ingredient-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Ingredient-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:24:48.535'
        },
        [PSCustomObject]@{
            tn    = 'Overhead-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Overhead-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:24:49.304'
        },
        [PSCustomObject]@{
            tn    = 'Recipe-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Recipe-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:24:50.336'
        },
        [PSCustomObject]@{
            tn    = 'RecipeIngredient-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/RecipeIngredient-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2023-01-28T06:49:24.173'
        },
        [PSCustomObject]@{
            tn    = 'Role-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Role-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:24:47.975'
        },
        [PSCustomObject]@{
            tn    = 'Supplier-lipwzvjrj5e5dgus2mtiogdk5i-staging'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Supplier-lipwzvjrj5e5dgus2mtiogdk5i-staging/stream/2022-07-16T14:24:49.184'
        })
    prod    = @(
        [PSCustomObject]@{
            tn    = 'Area-n4gpkhbth5etrojcbgkmegsqfe-prod'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Area-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:34:51.173'
        },
        [PSCustomObject]@{
            tn    = 'Category-n4gpkhbth5etrojcbgkmegsqfe-prod'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Category-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:41.198'
        },
        [PSCustomObject]@{
            tn    = 'Period-n4gpkhbth5etrojcbgkmegsqfe-prod'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Period-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:31.283'
        },
        [PSCustomObject]@{
            tn    = 'Store-n4gpkhbth5etrojcbgkmegsqfe-prod'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Store-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:40.878'
        },
        [PSCustomObject]@{
            tn    = 'Unit-n4gpkhbth5etrojcbgkmegsqfe-prod'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Unit-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:30.319'
        },
        [PSCustomObject]@{
            # tn    = 'Operation-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Operation-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Operation-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:30.876'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Operation-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:54.447'
        },
        [PSCustomObject]@{
            # tn    = 'Ingredient-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Ingredient-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Ingredient-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:39.522'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Ingredient-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:55.337'
        },
        [PSCustomObject]@{
            # tn    = 'Overhead-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Overhead-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Overhead-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:30.461'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Overhead-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:38:48.984'
        },
        [PSCustomObject]@{
            # tn    = 'Recipe-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Recipe-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Recipe-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:31.722'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Recipe-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:55.210'
        },
        [PSCustomObject]@{
            # tn    = 'RecipeIngredient-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'RecipeIngredient-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/RecipeIngredient-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:31.140'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/RecipeIngredient-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:54.296'
        },
        [PSCustomObject]@{
            # tn    = 'Role-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Role-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Role-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:30.935'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Role-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:54.481'
        },
        [PSCustomObject]@{
            # tn    = 'Supplier-n4gpkhbth5etrojcbgkmegsqfe-prod'
            tn    = 'Supplier-tluzsirwdndxlipyq2k5solz5y-prod'
            # esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Supplier-n4gpkhbth5etrojcbgkmegsqfe-prod/stream/2023-03-18T05:36:31.054'
            esarn = 'arn:aws:dynamodb:ap-southeast-2:633642160193:table/Supplier-tluzsirwdndxlipyq2k5solz5y-prod/stream/2023-07-02T12:39:54.667'
        })
}
