import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import WrapperMain from "@/components/wrapperMain"
import { FeedbackForm } from "./components/FeedbackForm"

const Feedback = () => {
  return (
    <WrapperMain classCustom="page-feedback bg-gray-50 min-h-screen">
      <section className="sec-feedback flex flex-col gap-y-4">
        {/* Header */}
        <div className="feedback-head bg-white sticky top-0 left-0 w-full z-50 py-4 px-2 border-b border-gray-100">
          <div className="container">
            <Link to={"/"} className="flex items-center gap-2 text-3xl font-medium text-gray-800">
              <ChevronLeft size={24} />
              <span>Thực đơn</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="feedback-main py-6">
          <div className="container max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
                <h2 className="text-4xl font-semibold text-gray-900">Góp ý dịch vụ</h2>
                <p className="text-2xl text-gray-500">
                  Mọi ý kiến của bạn sẽ giúp chúng tôi hoàn thiện chất lượng món ăn và dịch vụ tốt hơn.
                </p>
              </div>
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>
    </WrapperMain>
  )
}

export default Feedback
