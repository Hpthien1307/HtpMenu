## 1. Các lệnh kiểm tra cấu trúc (Lệnh của psql)

- \dt: Hiển thị danh sách các bảng
- \d <tên bảng>: Hiển thị chi tiết bảng ( /d "TableName )
- /l: Hiển thị danh sách các database
- \q: Thoát khỏi psql

## 2. Các truy vấn kiểm tra dữ liệu (Câu lệnh SQL)

_ SELECT \* FROM "TableName" : Xem toàn bộ dữ liệu trong bảng "TableName"
_ SELECT \* FROM "Order" ORDER BY "createdAt" DESC LIMIT 5; : Xem 5 dữ liệu mới nhất của bảng "Order"
