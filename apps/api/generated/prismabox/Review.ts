import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReviewPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    productId: t.String(),
    rating: t.Integer(),
    comment: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const ReviewRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        email: t.String(),
        password: t.String(),
        name: t.String(),
        role: t.Union(
          [t.Literal("CUSTOMER"), t.Literal("SELLER"), t.Literal("ADMIN")],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    product: t.Object(
      {
        id: t.String(),
        storeId: t.String(),
        categoryId: t.String(),
        name: t.String(),
        slug: t.String(),
        price: t.Number(),
        stock: t.Integer(),
        image: __nullable__(t.String()),
        createdAt: t.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ReviewPlainInputCreate = t.Object(
  { rating: t.Integer(), comment: t.Optional(__nullable__(t.String())) },
  { additionalProperties: false },
);

export const ReviewPlainInputUpdate = t.Object(
  {
    rating: t.Optional(t.Integer()),
    comment: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const ReviewRelationsInputCreate = t.Object(
  {
    user: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    product: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ReviewRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
      product: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const ReviewWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          productId: t.String(),
          rating: t.Integer(),
          comment: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Review" },
  ),
);

export const ReviewWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              userId_productId: t.Object(
                { userId: t.String(), productId: t.String() },
                { additionalProperties: false },
              ),
            },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              userId_productId: t.Object(
                { userId: t.String(), productId: t.String() },
                { additionalProperties: false },
              ),
            }),
          ],
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              userId: t.String(),
              productId: t.String(),
              rating: t.Integer(),
              comment: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Review" },
);

export const ReviewSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      productId: t.Boolean(),
      rating: t.Boolean(),
      comment: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      product: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ReviewInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), product: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const ReviewOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      rating: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      comment: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Review = t.Composite([ReviewPlain, ReviewRelations], {
  additionalProperties: false,
});

export const ReviewInputCreate = t.Composite(
  [ReviewPlainInputCreate, ReviewRelationsInputCreate],
  { additionalProperties: false },
);

export const ReviewInputUpdate = t.Composite(
  [ReviewPlainInputUpdate, ReviewRelationsInputUpdate],
  { additionalProperties: false },
);
