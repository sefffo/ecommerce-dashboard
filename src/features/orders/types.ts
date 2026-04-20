export interface OrderItemDto {
  productName: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface AddressDto {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipcode: string
}

export interface OrderDto {
  id: string
  userEmail: string
  orderItems: OrderItemDto[]
  shippingAddress: AddressDto
  deliveryMethod: string
  shippingPrice: number
  subtotal: number
  total: number
  orderStatus: string
  orderDate: string
  paymentIntentId: string
}
