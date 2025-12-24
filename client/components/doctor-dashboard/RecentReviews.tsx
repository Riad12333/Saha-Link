import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Star, MessageSquare } from "lucide-react"

interface ReviewsProps {
    reviews: any[]
}

export function RecentReviews({ reviews }: ReviewsProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Avis Récents</CardTitle>
            </CardHeader>
            <CardContent>
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="p-3 bg-muted/30 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <p className="font-medium text-sm">
                                            {review.patient?.name || review.patient?.user?.name || 'Patient'}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-xs text-muted-foreground italic pl-10">"{review.comment}"</p>
                                )}
                                <p className="text-[10px] text-right text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-3" />
                        <p className="text-sm text-muted-foreground">Aucun avis récent</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
