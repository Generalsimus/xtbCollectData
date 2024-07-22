import { db } from "../../db/db";

export const contactDbBars = async () => {
  const res = await Promise.all([
    db
      .updateTable("Bar")
      .from("Bar as lowStart")
      .set((eb) => ({
        startIntervalGroup: eb.ref("lowStart.startIntervalGroup"),
      }))
      .whereRef("lowStart.startIntervalGroup", "<", "Bar.startIntervalGroup")
      .whereRef("lowStart.endIntervalGroup", ">=", "Bar.startIntervalGroup")
      .execute(),
    db
      .updateTable("Bar")
      .from("Bar as hightEnd")
      .set((eb) => ({
        endIntervalGroup: eb.ref("hightEnd.endIntervalGroup"),
      }))
      .whereRef("hightEnd.startIntervalGroup", "<=", "Bar.endIntervalGroup")
      .whereRef("hightEnd.endIntervalGroup", ">", "Bar.endIntervalGroup")
      .execute(),
  ]);
  if (res.flat(2).some((el) => el.numUpdatedRows !== BigInt("0"))) {
    await contactDbBars();
  }
};
