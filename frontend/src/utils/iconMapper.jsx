import { HiChartBar, HiTrophy, HiChatBubbleLeftRight } from "react-icons/hi2"
import { HiClipboardList, HiUserAdd } from "react-icons/hi"

// Mapeo de nombres de íconos a componentes JSX
export const getIcon = (iconType, className = "text-4xl") => {
  const iconMap = {
    HiUserAdd: <HiUserAdd className={className} />,
    HiClipboardList: <HiClipboardList className={className} />,
    HiTrophy: <HiTrophy className={className} />,
    HiChartBar: <HiChartBar className={className} />,
    HiChatBubbleLeftRight: <HiChatBubbleLeftRight className={className} />,
  }

  return iconMap[iconType] || null
}
