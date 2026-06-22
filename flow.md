- khách hàng vào quán quét QR chứa link sau đó redirect qua App menu
  \_ global: icon dùng từ lib lucide react, import Link

## App Admin ( chủ shop )

1. Các page
   Xem số liệu dashboard
   Xem danh sách đơn order
   Xem danh sách Product ( món ăn / danh mục)
   Xem danh sách cần chi tiêu cho shop
   Xem danh sách nhân viên
   Xem thông tin góp ý
2. Page Dashboard ( số liệu )
   Tổng Products ( sản phẩm )
   Tổng Orders ( đơn hàng )
   Tổng Customers visiting ( khách đến quán )
   Tổng Revenue ( doanh thu )
   Dashboard ngày/tháng/năm/tuần
   Dashboard sản phẩm bán chạy
   Dashboard ngày bán chạy
   Dashboard tháng bán chạy
   Dashboard khung giờ bán chạy
   Dashboard tỉ lệ & các bàn được ngồi
3. Page Orders ( đơn hàng )
   Bộ lọc đơn hàng: ngày/tháng/năm, giờ giấc ,tổng bill, số bàn,
   Danh sách đơn hàng
   Đơn hàng chi tiết: ngày/tháng/năm/giờ giấc, số bàn, tổng bill, danh sách món
4. Page Products ( món ăn / danh mục)
   Bộ lọc món ăn: tên món, danh mục, giá bán, biến thể, combo
   Danh sách Product
   Product chi tiết: thumbnail, tên món, danh mục, giá bán edit, biến thể edit
5. Page Speding ( chi tiêu )
   Bộ lọc chi tiêu: tên, tag, giá tiền
   Ảnh/tên/tag/giá tiền
   xóa/thêm, edit ảnh, edit title, edit giá, edit tag (popup)
6. Page Employee ( nhân viên )
   Bộ lọc nhân viên: tên, vị trí, mức lương, ngày vào làm (mới nhất/ lâu nhất)
   Danh sách Employee
   Xóa/thêm, edit ảnh, edit tên, edit mức lương, edit ngày vào làm để tính thâm niên (popup)
7. Page Quản lí Opinion ( góp ý )
   Bộ lọc ngày/tháng/năm
   Danh sách góp ý
   Đánh dấu đã đọc/ chưa đọc, xóa góp ý
   Góp ý bao gồm: giới tính, năm sinh , nội dung

## App menu (khách hàng order)

## Các pages

1.  Home (danh sách món ăn, CTA góp ý, Button (danh sách món) fixed nằm bên dưới redirect qua page checkout)
2.  Checkout (danh sách món, số lượng, ghi chú mỗi món ăn, button ( Đặt món ))
3.  Đặt món thành công

## Components

1. Product item (thumbnail), title, số lượng, ghi chú
2. Select, input, textarea, input date
