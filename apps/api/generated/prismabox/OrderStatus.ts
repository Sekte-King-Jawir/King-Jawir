import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OrderStatus = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("PAID"),
    t.Literal("SHIPPED"),
    t.Literal("DONE"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
