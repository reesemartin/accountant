# Server

## Authentication

The auth module provides registration, login, and refresh token endpoints. It also provides a guard to protect routes from unauthenticated users.

Simply add the `@UseGuards(JwtAuthGuard)` decorator to any route you want to protect. If the request does not contain a valid JWT token, the request will be rejected with a `401 Unauthorized` response.

## Validation

### Request Body

When defining the DTO for your requests that accept a json body, you can use [class-validator](https://github.com/typestack/class-validator) decorators to define validation rules for your request body.

```typescript
import { IsInt, IsString } from 'class-validator'

export class CreateBaconDTO {
  @IsString()
  name: string

  @IsInt()
  weight: number
}
```

Then, you set the DTO as the type of the request body in your controller.

```typescript
@Post()
async create(@Body() createBaconDTO: CreateBaconDTO) {
  return this.baconService.create(createBaconDTO);
}
```

If the request body does not match the DTO, the request will be rejected with a `400 Bad Request` response.

### Request Query

When defining the DTO for your requests that use url query parameters, you can use [class-validator](https://github.com/typestack/class-validator) decorators to define validation rules for your request query parameters the same as your validation of request body. The primary difference is that you need to add the `@Expose()` decorator to each property and in your controller you will need to manually transform and validate the query. A helper function has been provided to facility this transformation and validation.

```typescript
import { Expose } from 'class-transformer'
import { IsInt, IsString } from 'class-validator'

export class GetBaconDTO {
  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsInt()
  weight: number
}
```

Then, you set a generic `Record<string, string>` as the type of the request query in your controller. Before passing the query along with your DTO to the transform and validate helper function.

```typescript
@Get()
async get(@Query() query: Record<string, string>) {
  const getBaconDTO = classTransformValidate(GetBaconDTO, query);
  return this.baconService.get(getBaconDTO);
}
```
