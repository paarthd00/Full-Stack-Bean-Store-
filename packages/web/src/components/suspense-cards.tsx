import { Link } from "@tanstack/react-router"

import { Card } from "@/components/ui/card"

function InnerCard() {
    return (
        <div
            className="h-[20rem]
                        bg-gray-200
                        dark:bg-gray-800
                        rounded-tl-lg
                        rounded-tr-lg
                        animate-pulse
                        w-[20rem]"
        ></div>
    )
}

function FullCard() {
    return (
        <Card className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-1000 animate-pulse">
            <div className="grid grid-cols-2 gap-2">
                <InnerCard />
                <InnerCard />
            </div>
            <div className="p-4 bg-gray-950">
                <h3 className="text-xl font-bold mb-2">Heading...</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Content Loading...</p>
                <Link
                    className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-gray-900 text-gray-50 font-medium transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="#"
                >
                    Add To Bag
                </Link>
            </div>
        </Card>
    )
}



export default function SuspenseCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FullCard />
            <FullCard />
        </div>
    )
}