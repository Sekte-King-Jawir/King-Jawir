import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderItemPlain = t.Object(
  {
    id: t.String(),
    orderId: t.String(),
    productId: t.String(),
    price: t.Number(),
    quantity: t.Integer(),
  },
  { additionalProperties: false },
);

export const OrderItemRelations = t.Object(
  {
    order: t.Object(
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
    product: t.Object(
      {
        id: t.String(),
        storeId: t.String(),
        categoryId: t.String(),
        name: t.String(),
        slug: t.String(),
        description: __nullable__(t.String()),
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

export const OrderItemPlainInputCreate = t.Object(
  { price: t.Number(), quantity: t.Integer() },
  { additionalProperties: false },
);

export const OrderItemPlainInputUpdate = t.Object(
  { price: t.Optional(t.Number()), quantity: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const OrderItemRelationsInputCreate = t.Object(
  {
    order: t.Object(
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

export const OrderItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      order: t.Object(
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

export const OrderItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          orderId: t.String(),
          productId: t.String(),
          price: t.Number(),
          quantity: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "OrderItem" },
  ),
);

export const OrderItemWhereUnique = t.Recursive(
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
              orderId: t.String(),
              productId: t.String(),
              price: t.Number(),
              quantity: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "OrderItem" },
);

export const OrderItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      orderId: t.Boolean(),
      productId: t.Boolean(),
      price: t.Boolean(),
      quantity: t.Boolean(),
      order: t.Boolean(),
      product: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const OrderItemInclude = t.Partial(
  t.Object(
    { order: t.Boolean(), product: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const OrderItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      orderId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      productId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      price: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      quantity: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const OrderItem = t.Composite([OrderItemPlain, OrderItemRelations], {
  additionalProperties: false,
});

export const OrderItemInputCreate = t.Composite(
  [OrderItemPlainInputCreate, OrderItemRelationsInputCreate],
  { additionalProperties: false },
);

export const OrderItemInputUpdate = t.Composite(
  [OrderItemPlainInputUpdate, OrderItemRelationsInputUpdate],
  { additionalProperties: false },
);
