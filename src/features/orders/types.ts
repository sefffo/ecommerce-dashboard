export interface OrderItemDto {
  productName: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface AddressDto {
  firstName: string
  lastName: string
  country: string
  street: string
  city: string
}

export interface OrderDto {
  id: string
  userEmail: string
  orderItems: OrderItemDto[]
  address: AddressDto
  deliveryMethod: string | null
  subTotal: number
  total: number
  orderStatus: string
  orderDate: string
  paymentInvoiceId: string
}
