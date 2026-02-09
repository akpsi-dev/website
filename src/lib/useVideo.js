import axios from "axios";
import useSWR from "swr";


const fetcher = async (s3Key) => {
	const res = await axios.get(`/api/presign-url?key=${encodeURIComponent(s3Key)}`);
    console.log(res.data);
    const data = res.data;
    if (data.error) {
        throw new Error(data.error + ": " + data.details);
    }
	return data;
};

function useVideo(s3Key) {
	const { data, error, isLoading } = useSWR(
		s3Key,
		fetcher,
	);

	return { video: data ?? {}, isLoading, error };
}

export default useVideo;
