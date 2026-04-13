"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api-url"
import { notifyAuthChanged } from "@/lib/auth-storage"

export default function AdminLogin(){

 const router = useRouter()

 const [email,setEmail] = useState("")
 const [password,setPassword] = useState("")

 const handleLogin = async ()=>{

  try {
   const res = await fetch(`${apiUrl}/api/auth/admin-login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({email,password})
   })

   const data = await res.json().catch(() => ({}))

   if(data.token){
    localStorage.setItem("adminToken",data.token)
    notifyAuthChanged()
    router.push("/admin")
    router.refresh()
    return
   }

   const msg = data.message || (res.ok ? "Không nhận được token" : `Lỗi ${res.status}`)
   alert(`Đăng nhập thất bại: ${msg}`)
  } catch (e) {
   console.error(e)
   const onLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
   const hint = onLocal
    ? `Bạn đang chạy trên localhost.\n\n• API đang dùng: ${apiUrl}\n• Mở URL Render trên trình duyệt 1 lần để service thức (cold start).\n• Deploy lại backend Render có CORS cho localhost + *.vercel.app.\n• Chạy lại npm run dev sau khi sửa .env.local.\n• Thử ẩn danh / tắt extension chặn request.`
    : `Kiểm tra NEXT_PUBLIC_API_URL trên Vercel và deploy backend Render mới nhất (CORS *.vercel.app).\n\nAPI: ${apiUrl}`
   alert(`Không kết nối được API.\n\n${hint}`)
  }

 }

 return(

  <div className="auth-container">

   <h2>Admin Login</h2>

   <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

   <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

   <button onClick={handleLogin}>Login</button>

   <p className="auth-switch">Chưa có tài khoản? <a href="/admin-register">Tạo Admin</a></p>

  </div>

 )

}