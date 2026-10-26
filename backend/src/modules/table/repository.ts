import { Table, Order } from '../../infrastructure/models';

export const getAllTables = async () => {
  const tables = await Table.find().sort({ table_number: 1 }).lean();
  return tables.map(t => ({
    id: t._id.toString(),
    tableNumber: t.table_number,
    status: t.status
  }));
};

export const updateTableStatusByNumber = async (tableNumber: string, status: string) => {
  await Table.findOneAndUpdate({ table_number: tableNumber }, { status });
};

export const getTableNumberByOrderId = async (orderId: string): Promise<string | null> => {
  const order = await Order.findById(orderId).lean();
  if (order && order.table_id) {
    const table = await Table.findOne({ table_number: order.table_id }).lean();
    return table ? table.table_number : order.table_id;
  }
  return null;
};
