import AssessmentWizard from "@/components/assessment/AssessmentWizard"

export default function AssessPage() {
    return (
        <div className="min-h-screen bg-background py-8 sm:py-12">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">New Assessment</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Fill in the details to get your instant classification.</p>
                </div>
                <AssessmentWizard />
            </div>
        </div>
    )
}
