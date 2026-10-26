import { Order, Bill } from '../../infrastructure/models';

export const getOrderDetails = async (orderId: string) => {
  const order = await Order.findById(orderId).lean();
  if (!order) return null;
  return {
    tableId: order.table_id,
    totalPrice: order.total_price
  };
};

export const createBill = async (orderId: string, tableId: string, totalAmount: number) => {
  const bill = new Bill({
    order_id: orderId,
    table_id: tableId,
    total_amount: totalAmount,
    status: 'pending'
  });
  await bill.save();
  return {
    id: bill._id.toString(),
    orderId: bill.order_id?.toString(),
    tableId: bill.table_id,
    totalAmount: bill.total_amount,
    status: bill.status,
    createdAt: bill.created_at
  };
};

export const getPendingBillByTable = async (tableId: string) => {
  const bill = await Bill.findOne({ table_id: tableId, status: 'pending' }).lean();
  if (!bill) return null;
  return {
    id: bill._id.toString(),
    orderId: bill.order_id?.toString(),
    tableId: bill.table_id,
    totalAmount: bill.total_amount,
    status: bill.status,
    createdAt: bill.created_at
  };
};

export const markBillAsPaid = async (billId: string) => {
  const bill = await Bill.findByIdAndUpdate(
    billId,
    { status: 'paid' },
    { new: true }
  ).lean();
  
  if (!bill) return null;
  return {
    id: bill._id.toString(),
    orderId: bill.order_id?.toString(),
    tableId: bill.table_id,
    totalAmount: bill.total_amount,
    status: bill.status,
    createdAt: bill.created_at
  };
};
