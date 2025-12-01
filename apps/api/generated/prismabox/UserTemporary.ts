import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserTemporaryPlain = t.Object(
  {
    id: t.String(),
    email: t.String(),
    password: t.String(),
    name: t.String(),
    token: t.String(),
    expiresAt: t.Date(),
    createdAt: t.Date(),
  },
  { additionalProperties: false },
);

export const UserTemporaryRelations = t.Object(
  {},
  { additionalProperties: false },
);

export const UserTemporaryPlainInputCreate = t.Object(
  {
    email: t.String(),
    password: t.String(),
    name: t.String(),
    token: t.String(),
    expiresAt: t.Date(),
  },
  { additionalProperties: false },
);

export const UserTemporaryPlainInputUpdate = t.Object(
  {
    email: t.Optional(t.String()),
    password: t.Optional(t.String()),
    name: t.Optional(t.String()),
    token: t.Optional(t.String()),
    expiresAt: t.Optional(t.Date()),
  },
  { additionalProperties: false },
);

export const UserTemporaryRelationsInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const UserTemporaryRelationsInputUpdate = t.Partial(
  t.Object({}, { additionalProperties: false }),
);

export const UserTemporaryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          email: t.String(),
          password: t.String(),
          name: t.String(),
          token: t.String(),
          expiresAt: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "UserTemporary" },
  ),
);

export const UserTemporaryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String(), token: t.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({ email: t.String() }),
            t.Object({ token: t.String() }),
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
              email: t.String(),
              password: t.String(),
              name: t.String(),
              token: t.String(),
              expiresAt: t.Date(),
              createdAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "UserTemporary" },
);

export const UserTemporarySelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      email: t.Boolean(),
      password: t.Boolean(),
      name: t.Boolean(),
      token: t.Boolean(),
      expiresAt: t.Boolean(),
      createdAt: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserTemporaryInclude = t.Partial(
  t.Object({ _count: t.Boolean() }, { additionalProperties: false }),
);

export const UserTemporaryOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      email: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      password: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      token: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const UserTemporary = t.Composite(
  [UserTemporaryPlain, UserTemporaryRelations],
  { additionalProperties: false },
);

export const UserTemporaryInputCreate = t.Composite(
  [UserTemporaryPlainInputCreate, UserTemporaryRelationsInputCreate],
  { additionalProperties: false },
);

export const UserTemporaryInputUpdate = t.Composite(
  [UserTemporaryPlainInputUpdate, UserTemporaryRelationsInputUpdate],
  { additionalProperties: false },
);
