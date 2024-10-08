"use client"

import { SchoolsCard } from "@/components/myaccount/schools-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { authService } from "@/lib/authentification/service"
import { navItems } from "@/lib/navigation"
import { schoolService } from "@/lib/school/service"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export default function ApplicationPage() {
  const query = useQuery({
    queryKey: ["userMeDetails"],
    queryFn: authService.getUserMeDetails,
    retry: 0,
  })

  const userSchoolsQuery = useQuery({
    queryKey: ["userSchools"],
    queryFn: schoolService.getUserSchools,
    retry: 0,
  })

  if (query.isLoading || userSchoolsQuery.isLoading) {
    return (
      <div>
        <Skeleton className="h-[50px]" />
        <Skeleton className="h-[100px]" />
      </div>
    )
  }

  if (
    query.isError ||
    !query.data ||
    query.data.school_ids.length === 0 ||
    userSchoolsQuery.isError ||
    !userSchoolsQuery.data
  ) {
    return (
      <div className="flex items-center justify-center my-5">
        <Card className="min-w-sm">
          <CardHeader>
            <CardTitle>{"Complétez d'abord votre profil"}</CardTitle>
            <CardDescription>
              {
                "Complétez les informations manquantes de votre profil pour accéder aux listes."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={navItems["MyAccount"].href}>
                {"Aller à mon compte"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-semibold text-center">
        {"Choisir une école"}
      </h1>
      <div className="flex flex-wrap gap-4 py-5 justify-center cursor-pointer">
        {userSchoolsQuery.data.map((school) => (
          <SchoolsCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  )
}
