import AssessmentWizard from "@/components/assessment/AssessmentWizard"

export default function AssessPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight">New Assessment</h1>
                    <p className="text-gray-500 mt-2">Fill in the details to get your instant classification.</p>
                </div>
                <AssessmentWizard />
            </div>
        </div>
    )
}
