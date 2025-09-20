import { useMenuQuery } from "@/lib/quries/menu";

import Loading from "@/components/common/LoadingComponent";
import ErrorComponent from "@/components/common/ErrorComponent";
import MenuList from "@/components/menu/MenuList";

export default function Page() {
  const { data, isLoading, error } = useMenuQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <main className="h-screen">
      <MenuList data={data} />
    </main>
  );
}
