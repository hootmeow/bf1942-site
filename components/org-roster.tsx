"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Shield, User, Trash2 } from "lucide-react"

interface Member {
  user_id: number
  name: string
  image?: string | null
  role: string
  joined_at: string
}

interface OrgRosterProps {
  roster: Member[]
  isLeader?: boolean
  currentUserId?: string | null
  onRemove?: (userId: number) => void
  onChangeRole?: (userId: number, newRole: string) => void
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  leader: <Crown className="h-3.5 w-3.5 text-amber-500" />,
  officer: <Shield className="h-3.5 w-3.5 text-blue-500" />,
  member: <User className="h-3.5 w-3.5 text-muted-foreground" />,
}

const ROLE_COLORS: Record<string, string> = {
  leader: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  officer: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  member: "bg-secondary text-muted-foreground",
}

export function OrgRoster({ roster, isLeader, currentUserId, onRemove, onChangeRole }: OrgRosterProps) {
  return (
    <div className="space-y-2">
      {roster.map((member) => (
        <div key={member.user_id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8">
              {member.image && <AvatarImage src={member.image} />}
              <AvatarFallback className="text-xs">{member.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{member.name}</p>
              <p className="text-[10px] text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`gap-1 ${ROLE_COLORS[member.role] || ""}`}>
              {ROLE_ICONS[member.role]}
              {member.role}
            </Badge>

            {isLeader && String(member.user_id) !== currentUserId && (
              <div className="flex items-center gap-1">
                <select
                  className="text-xs bg-background border border-input rounded px-1.5 py-1"
                  value={member.role}
                  onChange={(e) => onChangeRole?.(member.user_id, e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="officer">Officer</option>
                  <option value="leader">Leader</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onRemove?.(member.user_id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Leave button for self */}
            {String(member.user_id) === currentUserId && member.role !== "leader" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive"
                onClick={() => onRemove?.(member.user_id)}
              >
                Leave
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
