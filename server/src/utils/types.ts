export type TResponse = {
  errCode: [-1, 0, 1][number];
  msg: string;
  data?: any;
};
