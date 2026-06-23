import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import publicRoutes from "@/routes"

const App = () => {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((item, index) => {
          const Page = item.component
          return <Route key={index} path={item.path} element={<Page />} />
        })}
      </Routes>
    </Router>
  )
}
export default App
