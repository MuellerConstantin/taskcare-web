import Image from "next/image";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

export default function BoardLogo({ boardId, className }) {
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(boardId ? `/boards/${boardId}/logo-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 w-32 h-32 ${className}`} />
    );
  } else if(error) {
    if(error.status === 404) {
      return (
        <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 overflow-hidden ${className}`}>
          <IdentIcon value={boardId} />
        </div>
      );
    } else {
      return (
        <div className={`bg-red-200 dark:bg-red-400 w-32 h-32 ${className}`} />
      );
    }
  } else {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 relative overflow-hidden ${className}`}>
        <Image
          src={data}
          alt={boardId}
          fill
          objectFit="cover"
          layout="fill"
        />
      </div>
    );
  }
}
