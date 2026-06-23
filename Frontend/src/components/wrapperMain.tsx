import React from "react"

const WrapperMain = ({ classCustom, children }: { classCustom: string; children: React.ReactNode }) => {
  return <main className={`pb-60 ${classCustom}`}>{children}</main>
}

export default WrapperMain
