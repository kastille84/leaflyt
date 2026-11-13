## Table `assets`

### Columns

| Name                | Type          | Constraints |
| ------------------- | ------------- | ----------- |
| `id`                | `uuid`        | Primary     |
| `created_at`        | `timestamptz` |             |
| `user`              | `uuid`        | Nullable    |
| `used_by_flyers`    | `_json`       |             |
| `used_by_templates` | `_json`       |             |
| `asset_info`        | `json`        | Nullable    |

## Table `boards`

list of google places that have flyers

### Columns

| Name               | Type          | Constraints             |
| ------------------ | ------------- | ----------------------- |
| `id`               | `int8`        | Primary Unique Identity |
| `placeId`          | `varchar`     | Primary Unique          |
| `name`             | `varchar`     | Nullable                |
| `formattedAddress` | `text`        | Nullable                |
| `latlng`           | `json`        | Nullable                |
| `tags`             | `_json`       | Nullable                |
| `created_at`       | `timestamptz` |                         |

## Table `customers`

Holds the paying customers info

### Columns

| Name                 | Type          | Constraints     |
| -------------------- | ------------- | --------------- |
| `id`                 | `uuid`        | Primary         |
| `created_at`         | `timestamptz` |                 |
| `customerId`         | `text`        | Unique          |
| `subscriptionId`     | `text`        | Nullable Unique |
| `productId`          | `text`        | Nullable        |
| `subscriptionStatus` | `text`        | Nullable        |
| `user`               | `uuid`        |                 |

## Table `flyers`

### Columns

| Name            | Type             | Constraints |
| --------------- | ---------------- | ----------- |
| `id`            | `uuid`           | Primary     |
| `created_at`    | `timestamptz`    |             |
| `user`          | `uuid`           | Nullable    |
| `place`         | `text`           | Nullable    |
| `title`         | `text`           | Nullable    |
| `category`      | `text`           | Nullable    |
| `subcategory`   | `text`           | Nullable    |
| `content`       | `text`           | Nullable    |
| `tags`          | `_json`          |             |
| `fileUrlArr`    | `_json`          | Nullable    |
| `typeOfUser`    | `text`           | Nullable    |
| `attestation`   | `bool`           | Nullable    |
| `individual`    | `json`           | Nullable    |
| `business`      | `json`           | Nullable    |
| `organization`  | `json`           | Nullable    |
| `template`      | `uuid`           | Nullable    |
| `postingMethod` | `posting_method` | Nullable    |
| `flyerDesign`   | `json`           | Nullable    |
| `callToAction`  | `json`           | Nullable    |
| `lifespan`      | `int2`           | Nullable    |
| `likes`         | `int8`           | Nullable    |
| `flagged`       | `bool`           |             |
| `flaggedReason` | `json`           | Nullable    |
| `expires_at`    | `timestamptz`    | Nullable    |
| `flagged_at`    | `timestamptz`    | Nullable    |
| `hasComments`   | `bool`           | Nullable    |

## Table `plans`

### Columns

| Name                     | Type                | Constraints      |
| ------------------------ | ------------------- | ---------------- |
| `id`                     | `int8`              | Primary Identity |
| `created_at`             | `timestamptz`       |                  |
| `lifespan`               | `numeric`           | Nullable         |
| `numOfMedia`             | `numeric`           |                  |
| `name`                   | `text`              | Nullable         |
| `subtitle`               | `text`              | Nullable         |
| `price`                  | `float4`            | Nullable         |
| `onLocationPostingLimit` | `numeric`           | Nullable         |
| `remotePostingLimit`     | `numeric`           | Nullable         |
| `templateLimit`          | `numeric`           | Nullable         |
| `virtualPostingDistance` | `numeric`           | Nullable         |
| `level`                  | `numeric`           | Nullable         |
| `hasBulkPosting`         | `bool`              |                  |
| `hasAnalytics`           | `type_of_analytics` | Nullable         |
| `priceDescription`       | `text`              | Nullable         |
| `maxAssets`              | `int2`              | Nullable         |
| `stripeProductId`        | `text`              | Nullable         |

## Table `profiles`

### Columns

| Name            | Type           | Constraints |
| --------------- | -------------- | ----------- |
| `id`            | `uuid`         | Primary     |
| `created_at`    | `timestamptz`  |             |
| `user`          | `uuid`         | Unique      |
| `name`          | `text`         | Nullable    |
| `firstName`     | `text`         | Nullable    |
| `lastName`      | `text`         | Nullable    |
| `email`         | `text`         | Nullable    |
| `phone`         | `text`         | Nullable    |
| `website`       | `text`         | Nullable    |
| `typeOfUser`    | `type_of_user` |             |
| `address`       | `jsonb`        |             |
| `avatar`        | `text`         | Nullable    |
| `plan`          | `int8`         | Nullable    |
| `termsAccepted` | `bool`         |             |
| `powerUser`     | `bool`         |             |
| `pioneer`       | `bool`         | Nullable    |

## Table `saved_flyers`

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `id`         | `uuid`        | Primary     |
| `created_at` | `timestamptz` |             |
| `user`       | `uuid`        | Nullable    |
| `flyer`      | `uuid`        | Nullable    |

## Table `templates`

### Columns

| Name           | Type          | Constraints |
| -------------- | ------------- | ----------- |
| `id`           | `uuid`        | Primary     |
| `created_at`   | `timestamptz` |             |
| `user`         | `uuid`        |             |
| `title`        | `text`        | Nullable    |
| `category`     | `text`        | Nullable    |
| `subcategory`  | `text`        | Nullable    |
| `content`      | `text`        | Nullable    |
| `tags`         | `_json`       |             |
| `fileUrlArr`   | `_json`       |             |
| `templateName` | `text`        | Nullable    |
| `flyerDesign`  | `json`        | Nullable    |
| `callToAction` | `json`        | Nullable    |
| `lifespan`     | `int2`        | Nullable    |
| `likes`        | `int8`        | Nullable    |
| `hasComments`  | `bool`        | Nullable    |

## Table `qr_analytics`

track qr clicks on physical flyer

### Columns

| Name               | Type          | Constraints      |
| ------------------ | ------------- | ---------------- |
| `id`               | `int8`        | Primary Identity |
| `created_at`       | `timestamptz` |                  |
| `placeId`          | `varchar`     |                  |
| `name`             | `text`        |                  |
| `formattedAddress` | `text`        |                  |
| `scanDate`         | `text`        |                  |

## Custom Types / Enums

### `posting_method`

`onLocation` | `remote` | `remoteBulk`

### `type_of_analytics`

`lite` | `full`

### `type_of_user`

`individual` | `business` | `organization`

## RLS Policies

### `templates`

| Policy                 | Command | Roles         | Action     | USING                                                                                                                 | WITH CHECK                                                                                                            |
| ---------------------- | ------- | ------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `All Select`           | SELECT  | public        | PERMISSIVE | `true`                                                                                                                | —                                                                                                                     |
| `All Update`           | UPDATE  | public        | PERMISSIVE | `true`                                                                                                                | —                                                                                                                     |
| `Authenticated Delete` | DELETE  | authenticated | PERMISSIVE | `(( SELECT auth.uid() AS uid) = ( SELECT profiles."user"    FROM profiles   WHERE (profiles.id = templates."user")))` | —                                                                                                                     |
| `Authorized Insert`    | INSERT  | authenticated | PERMISSIVE | —                                                                                                                     | `(( SELECT auth.uid() AS uid) = ( SELECT profiles."user"    FROM profiles   WHERE (profiles.id = templates."user")))` |

### `assets`

| Policy           | Command | Roles  | Action     | USING                                                                                                              | WITH CHECK |
| ---------------- | ------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------ | ---------- |
| `All for Assets` | ALL     | public | PERMISSIVE | `(( SELECT auth.uid() AS uid) = ( SELECT profiles."user"    FROM profiles   WHERE (profiles.id = assets."user")))` | —          |

### `boards`

| Policy                        | Command | Roles  | Action     | USING  | WITH CHECK |
| ----------------------------- | ------- | ------ | ---------- | ------ | ---------- |
| `Enable all public actions`   | ALL     | public | PERMISSIVE | `true` | —          |
| `Enable all users to select`  | SELECT  | public | PERMISSIVE | `true` | —          |
| `Enable insert for all users` | INSERT  | public | PERMISSIVE | —      | `false`    |

### `customers`

| Policy         | Command | Roles  | Action     | USING  | WITH CHECK |
| -------------- | ------- | ------ | ---------- | ------ | ---------- |
| `Allow Delete` | DELETE  | public | PERMISSIVE | `true` | —          |
| `Allow Insert` | INSERT  | public | PERMISSIVE | —      | `true`     |
| `Allow Read`   | SELECT  | public | PERMISSIVE | `true` | —          |
| `Allow Update` | UPDATE  | public | PERMISSIVE | `true` | —          |

### `flyers`

| Policy                        | Command | Roles  | Action     | USING  | WITH CHECK |
| ----------------------------- | ------- | ------ | ---------- | ------ | ---------- |
| `Allow all actions for users` | ALL     | public | PERMISSIVE | `true` | —          |

### `plans`

| Policy                             | Command | Roles  | Action     | USING  | WITH CHECK |
| ---------------------------------- | ------- | ------ | ---------- | ------ | ---------- |
| `Enable read access for all users` | SELECT  | public | PERMISSIVE | `true` | —          |

### `qr_analytics`

| Policy        | Command | Roles  | Action     | USING  | WITH CHECK |
| ------------- | ------- | ------ | ---------- | ------ | ---------- |
| `All allowed` | ALL     | public | PERMISSIVE | `true` | —          |

### `profiles`

| Policy                        | Command | Roles         | Action     | USING                   | WITH CHECK |
| ----------------------------- | ------- | ------------- | ---------- | ----------------------- | ---------- |
| `All Update for Authorized`   | UPDATE  | authenticated | PERMISSIVE | `("user" = auth.uid())` | —          |
| `Allow Delete for Authorized` | DELETE  | authenticated | PERMISSIVE | `("user" = auth.uid())` | —          |
| `Allow Insert`                | INSERT  | public        | PERMISSIVE | —                       | `true`     |
| `Allow Read`                  | SELECT  | public        | PERMISSIVE | `true`                  | —          |

### `saved_flyers`

| Policy                 | Command | Roles  | Action     | USING  | WITH CHECK |
| ---------------------- | ------- | ------ | ---------- | ------ | ---------- |
| `All for Saved Flyers` | ALL     | public | PERMISSIVE | `true` | —          |
