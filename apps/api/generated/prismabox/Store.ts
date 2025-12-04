import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StorePlain = t.Object(
  {
    id: t.String(),
    userId: t.String(),
    name: t.String(),
    slug: t.String(),
    description: __nullable__(t.String()),
    logo: __nullable__(t.String()),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const StoreRelations = t.Object(
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
    products: t.Array(
      t.Object(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const StorePlainInputCreate = t.Object(
  {
    name: t.String(),
    slug: t.String(),
    description: t.Optional(__nullable__(t.String())),
    logo: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StorePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String()),
    slug: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    logo: t.Optional(__nullable__(t.String())),
  },
  { additionalProperties: false },
);

export const StoreRelationsInputCreate = t.Object(
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
    products: t.Optional(
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

export const StoreRelationsInputUpdate = t.Partial(
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
      products: t.Partial(
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

export const StoreWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          userId: t.String(),
          name: t.String(),
          slug: t.String(),
          description: t.String(),
          logo: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Store" },
  ),
);

export const StoreWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), userId: t.String(), slug: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ userId: t.String() }),
            t.Object({ slug: t.String() }),
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
              name: t.String(),
              slug: t.String(),
              description: t.String(),
              logo: t.String(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Store" },
);

export const StoreSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      userId: t.Boolean(),
      name: t.Boolean(),
      slug: t.Boolean(),
      description: t.Boolean(),
      logo: t.Boolean(),
      createdAt: t.Boolean(),
      user: t.Boolean(),
      products: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const StoreInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), products: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const StoreOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      slug: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      logo: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Store = t.Composite([StorePlain, StoreRelations], {
  additionalProperties: false,
});

export const StoreInputCreate = t.Composite(
  [StorePlainInputCreate, StoreRelationsInputCreate],
  { additionalProperties: false },
);

export const StoreInputUpdate = t.Composite(
  [StorePlainInputUpdate, StoreRelationsInputUpdate],
  { additionalProperties: false },
);
