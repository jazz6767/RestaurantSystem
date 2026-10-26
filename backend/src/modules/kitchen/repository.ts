import { KitchenTicket, Order } from '../../infrastructure/models';

export const createKitchenTicket = async (
  orderId: string,
  tableId: string,
  comboName: string,
  quantity: number,
  notes: string
) => {
  const ticket = new KitchenTicket({
    order_id: orderId,
    table_id: tableId,
    combo_name: comboName,
    quantity,
    notes: notes || '',
    status: 'pending'
  });
  await ticket.save();
  return { ...ticket.toObject(), id: ticket._id.toString() };
};

export const getActiveTickets = async () => {
  const tickets = await KitchenTicket.find({
    status: { $in: ['pending', 'cooking'] }
  }).sort({ created_at: 1 }).lean();
  
  return tickets.map(t => ({
    id: t._id.toString(),
    orderId: t.order_id?.toString(),
    tableId: t.table_id,
    comboName: t.combo_name,
    quantity: t.quantity,
    notes: t.notes,
    status: t.status,
    createdAt: t.created_at
  }));
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const ticket = await KitchenTicket.findByIdAndUpdate(
    ticketId,
    { status },
    { new: true }
  ).lean();
  
  if (!ticket) return null;
  return {
    id: ticket._id.toString(),
    orderId: ticket.order_id?.toString(),
    tableId: ticket.table_id,
    comboName: ticket.combo_name,
    quantity: ticket.quantity,
    notes: ticket.notes,
    status: ticket.status,
    createdAt: ticket.created_at
  };
};

export const getComboNameByOrderId = async (orderId: string): Promise<string> => {
  const order = await Order.findById(orderId).lean();
  return order?.combo_name || 'Unknown Combo';
};
