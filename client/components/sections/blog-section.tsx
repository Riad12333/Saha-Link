"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export function BlogSection() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${api.blog}?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setArticles(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching blog articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <section className="w-full py-20 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{t("blog.title")}</h2>
            <p className="text-muted-foreground">{t("blog.subtitle")}</p>
          </div>
          <Link href="/blog">
            <Button variant="outline">{t("blog.view_all")}</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">{t("featured.loading")}</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden hover:shadow-lg transition">
                <CardHeader className="p-0 h-48 relative overflow-hidden bg-primary/10">
                  {article.image ? (
                    <img
                      src={article.image.startsWith('http') ? article.image : article.image.startsWith('/') ? article.image : `/${article.image}`}
                      alt={article.title}
                      className="w-full h-full object-cover transition transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-blog.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-foreground/20">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded">
                    {article.category}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.author?.name || "Dr. Medecine"}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  <Link href={`/blog/${article.slug}`} className="text-primary text-sm font-semibold hover:underline">
                    {t("blog.read_more")}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">Aucun article disponible</div>
        )}
      </div>
    </section>
  )
}
