// src/app/page.tsx
import Link from "next/link";
// Simple icons for demonstration
const HomeIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.955-8.955c.49-.49 1.285-.49 1.775 0L21.75 12m-2.25 2.25l-2.75 2.75m-6-6v6m0-6H6.75M9 6v6m0-6h2.25" /></svg>;
const PencilSquareIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 18.07a4.5 4.5 0 01-1.897 1.13L6 20l1.128-3.372a4.5 4.5 0 011.13-1.897l8.283-8.283z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.582 18.07L16.863 11.79" /></svg>;
const CloudArrowUpIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3.75 3.75M12 9.75L8.25 13.5m-3.75 5.25a3 3 0 01-3-3V12a2.25 2.25 0 014.5 0v3.75a2.25 2.25 0 004.5 0V12a2.25 2.25 0 014.5 0v3.75a2.25 2.25 0 004.5 0V12a3 3 0 00-3-3M15 9.75V6.75a3.75 3.75 0 00-7.5 0v3.0" /></svg>;


// --- Hero Section ---
const HeroSection = () => (
    // FIX: Change dark:bg-gray-800 to dark:bg-gray-900 to match the body/header/footer background.
    <section className="text-center py-20 sm:py-32 bg-indigo-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-3xl px-4">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-50 mb-4 tracking-tighter">
                Write. Publish. Grow.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">
                BlogSpace is the simple, powerful platform for sharing your voice. Built with the best of modern web technology.
            </p>
            <Link
                href="/admin/post/new"
                className="inline-block bg-indigo-600 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-xl hover:bg-indigo-700 transition-colors duration-200"
            >
                Start Writing Now
            </Link>
        </div>
    </section>
);

// --- Features Section ---
const FeaturesSection = () => {
    const features = [
        {
            icon: PencilSquareIcon,
            title: "Markdown Editor",
            description: "Fast and easy content creation with built-in Markdown rendering support.",
        },
        {
            icon: HomeIcon,
            title: "Full CRUD API",
            description: "Complete Create, Read, Update, Delete functionality powered by type-safe tRPC and Drizzle ORM.",
        },
        {
            icon: CloudArrowUpIcon,
            title: "Draft & Publish",
            description: "Control your content lifecycle with explicit draft and published statuses.",
        },
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto max-w-6xl px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature) => (
                        <div key={feature.title} className="text-center p-6 border rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
                            <feature.icon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            {/* The Footer is now in layout.tsx, fulfilling the third section */}
        </>
    );
}