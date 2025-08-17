import dayjs from "dayjs";

export const getDate = (date: Date | string): string => {
  const dayjsDate = dayjs(date);

  return dayjsDate.isValid() ? dayjsDate.format(DateFormat.DEFAULT) : "";
};

export enum DateFormat {
  DEFAULT = "DD.MM.YYYY HH:mm",
  DATE = "DD.MM.YYYY",
  ISO = "YYYY-MM-DDTHH:mm:ssZ",
}
