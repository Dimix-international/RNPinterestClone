import {ActivityIndicator, Image, StyleSheet, Text} from "react-native";
import {useEffect, useState} from "react";
import {useNhostClient} from "@nhost/react";

const RemoteImage = ({fileId}: any) => {

    const [aspectRatio, setAspectRatio] = useState(1);

    const [imageUri, setImageUri] = useState<string | null>(null);
    const nhost = useNhostClient();

    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (width, height) => {
                setAspectRatio(width / height);
            });
        }
    },[imageUri]);

    useEffect(() => {

        const fetchImage = async () => {
            const result =  await nhost.storage.getPresignedUrl({
                fileId
            });
            if(result.presignedUrl) {
                setImageUri(result.presignedUrl.url);
            }
        };

        fetchImage();

    },[fileId]);

    if (!imageUri) {
        return <ActivityIndicator/>
    }

    return (
        <>
            <Image
            source={{uri: imageUri}}
            style={[styles.image, {
                aspectRatio: aspectRatio
            }]}
        /></>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        borderRadius: 16,
    },
});


export default RemoteImage;