import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderPlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    status: t.Union(
      [
        t.Literal("PENDING"),
        t.Literal("PAID"),
        t.Literal("SHIPPED"),
        t.Literal("DONE"),
        t.Literal("CANCELLED"),
      ],
      { additionalProperties: false },
    ),
    total: t.Number(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const OrderRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String(),
        email: t.String(),
        password: __nullable__(t.String()),
        name: t.String(),
        emailVerified: t.Boolean(),
        googleId: __nullable__(t.String()),
        avatar: __nullable__(t.String()),
        phone: __nullable__(t.String()),
        address: __nullable__(t.String()),
        bio: __nullable__(t.String()),
        role: t.Union(
          [t.Literal("CUSTOMER"), t.Literal("SELLER"), t.Literal("ADMIN")],
          { additionalProperties: false },
        ),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      },
      { additionalProperties: false },
    ),
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          orderId: t.String(),
          productId: t.String(),
          price: t.Number(),
          quantity: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const OrderPlainInputCreate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("PAID"),
          t.Literal("SHIPPED"),
          t.Literal("DONE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    total: t.Number(),
  },
  { additionalProperties: false },
);

export const OrderPlainInputUpdate = t.Object(
  {
    status: t.Optional(
      t.Union(
        [
          t.Literal("PENDING"),
          t.Literal("PAID"),
          t.Literal("SHIPPED"),
          t.Literal("DONE"),
          t.Literal("CANCELLED"),
        ],
        { additionalProperties: false },
      ),
    ),
    total: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const OrderRelationsInputCreate = t.Object(
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
    items: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const OrderRelationsInputUpdate = t.Partial(
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
      items: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const OrderWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          status: t.Union(
            [
              t.Literal("PENDING"),
              t.Literal("PAID"),
              t.Literal("SHIPPED"),
              t.Literal("DONE"),
              t.Literal("CANCELLED"),
            ],
            { additionalProperties: false },
          ),
          total: t.Number(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Order" },
  ),
);

export const OrderWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
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
              status: t.Union(
                [
                  t.Literal("PENDING"),
                  t.Literal("PAID"),
                  t.Literal("SHIPPED"),
                  t.Literal("DONE"),
                  t.Literal("CANCELLED"),
                ],
                { additionalProperties: false },
              ),
              total: t.Number(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Order" },
);

export const OrderSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      status: t.Boolean(),
      total: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderInclude = t.Partial(
  t.Object(
    {
      status: t.Boolean(),
      user: t.Boolean(),
      items: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      total: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Order = t.Composite([OrderPlain, OrderRelations], {
  additionalProperties: false,
});

export const OrderInputCreate = t.Composite(
  [OrderPlainInputCreate, OrderRelationsInputCreate],
  { additionalProperties: false },
);

export const OrderInputUpdate = t.Composite(
  [OrderPlainInputUpdate, OrderRelationsInputUpdate],
  { additionalProperties: false },
);
