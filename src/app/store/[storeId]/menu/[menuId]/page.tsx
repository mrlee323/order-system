import MenuDetail from "@/components/menu/MenuDetail";

interface MenuDetailPageProps {
  params: Promise<{ storeId: string; menuId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string; menuId: string }>;
}) {
  const { storeId, menuId } = await params;

  return {
    title: `메뉴 상세 - 매장 ${storeId}`,
    description: "메뉴 상세 정보",
  };
}

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { storeId, menuId } = await params;

  return <MenuDetail storeId={storeId} menuId={menuId} />;
}
