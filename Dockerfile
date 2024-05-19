# ใช้ภาพพื้นฐานของ Node.js เวอร์ชัน 16
FROM node:16

# ตั้งค่าไดเรกทอรีทำงานใน container
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยังไดเรกทอรีทำงาน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดของแอปพลิเคชันไปยังไดเรกทอรีทำงาน
COPY . .

# เปิดพอร์ตที่แอปพลิเคชันจะใช้
EXPOSE 5713

# กำหนดคำสั่งที่ใช้รันแอปพลิเคชัน
CMD ["node", "app.js"]