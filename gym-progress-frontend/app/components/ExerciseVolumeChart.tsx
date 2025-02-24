import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ExeToolTip from "@/app/components/ExeToolTip";

interface VolumeHistory {
    workout_date: string;
    total_volume: string;
}



export default function ExerciseVolumeChart({ exerciseId }: props) {
    const { data: session } = useSession(); // Ensure this is defined before use
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataSet, setDataSet] = useState<VolumeHistory[]>([])
    const token = session?.user?.authToken || localStorage.getItem("token");
    const server = process.env.NEXT_PUBLIC_BACKEND;
    const userId = session?.user?.id || localStorage.getItem("userId");
    const [maxValue, setMaxValue] = useState<number>(0);
    const [minValue, setMinValue] = useState<number>(0);

    if (!token) {
        setError("No authentication session found. Please log in.");
        return;
    }

    useEffect(() => {
        let isMounted = true; // Prevents setting state if component unmounts

        if (exerciseId) fetchVolumeHistory(exerciseId);

        return () => {
            isMounted = false; // Cleanup to prevent state updates on unmounted components
        };
    }, [exerciseId])

    const fetchVolumeHistory = async (exerciseId: number) => {
        setLoading(true);

        try {
            const volumeHistory = await fetch(`${server}/api/user/${userId}/exercises/${exerciseId}/volume-history`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log('volumeHistory');

            const data: VolumeHistory[] = await volumeHistory.json();

            const dataRefined = data.map((workout) => {
                return {
                    'workout_date': shortenedDate(workout.workout_date),
                    'total_volume': workout.total_volume.split('.')[0]
                }
            })
            
            setDataSet(dataRefined);
            setMaxValue(findMaxValue(dataRefined));
            setMinValue(findMinValue(dataRefined));

            console.dir(dataRefined);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }

    const shortenedDate = (date: string) => {
        let dateArr = date.split('T')[0].split('-');
        const year = dateArr[0].slice(-2);
        const month = dateArr[1];
        const day = dateArr[2];
                
        return `${month}/${day}/${year}`;
    }

    const findMaxValue = (data: Array) => {
        let value = 0;
        data.forEach((entry: VolumeHistory) => {
            if (Number(entry.total_volume) > value) {
                value = Number(entry.total_volume);
            }
        })
        return value;
    }

    
    const findMinValue = (data: Array) => {
        let value = 100000;
        data.forEach((entry: VolumeHistory) => {
            if (Number(entry.total_volume) < value) {
                value = Number(entry.total_volume);
            }
        })
        return value;
    }

    if (loading) return <p>Loading chart...</p>;
    if (dataSet.length === 0) return <p>No data available.</p>;

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataSet}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="workout_date" 
                        />
                    <YAxis 
                        dataKey="total_volume"
                        domain={[minValue-200, maxValue+500]}
                    />
                    <Tooltip content={<ExeToolTip />} />
                    <Line type="monotone" dataKey="total_volume" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}