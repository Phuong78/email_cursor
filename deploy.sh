#!/bin/bash

# Dừng lại ngay nếu có lỗi
set -e

# Tiêu đề cho rõ ràng
echo "🚀 Bắt đầu quá trình triển khai hạ tầng (Terraform)..."

# 1. Chạy Terraform để tạo/cập nhật hạ tầng VÀ tạo file inventory.ini
cd infra
terraform apply --auto-approve
cd .. # Quay lại thư mục gốc

# Chờ một chút để EC2 khởi động hoàn toàn và SSH sẵn sàng
echo "⏳ Chờ 60 giây để EC2 khởi động hoàn toàn..."
sleep 60

# 2. Chạy Ansible để cài đặt Nagios
echo "⚙️  Bắt đầu cài đặt Nagios và các dịch vụ qua Ansible..."
ansible-playbook -i inventory.ini install_nagios.yml

# 3. Lấy IP mới từ file inventory (cách này ổn định hơn)
echo "✅ Lấy địa chỉ IP mới..."
NEW_IP=$(grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' inventory.ini)

echo "👍 IP mới của máy chủ là: $NEW_IP"

# 4. Tự động cập nhật file .env của dự án React
echo "⚛️  Đang cập nhật IP vào file .env của React..."
# ... (Phần này giữ nguyên như trước) ...
echo "REACT_APP_NAGIOS_IP=$NEW_IP" > frontend/.env

echo "🎉 Hoàn tất! Hạ tầng đã sẵn sàng và Nagios đã được cài đặt."
echo "🔗 Truy cập Nagios tại: http://$NEW_IP/nagios"