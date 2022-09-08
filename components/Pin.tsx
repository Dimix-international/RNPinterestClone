import {Text, View} from "./Themed";
import {Pressable, StyleSheet} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import RemoteImage from "./RemoteImage";

export type PinType = {
    title: string,
    image: string,
    id: string
}

const Pin = ({title, image, id}: PinType) => {

    const navigation = useNavigation();


    const onLike = () => {}
    const goToPinPage = () => {
        // @ts-ignore
        navigation.navigate('Pin', {
            id
        });
    }

    return (
        <Pressable onPress={goToPinPage} style={styles.pin}>
            <View>
                {
                    image && <RemoteImage fileId={image}/>
                }
                <Pressable
                    style={styles.heartButton}
                    onPress={onLike}
                >
                    <AntDesign
                        name={'hearto'}
                        size={16}
                        color={'black'}
                    />
                </Pressable>
            </View>

            <Text
                style={styles.title}
                numberOfLines={2}
            >
                {title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    pin: {
        width: '100%',
        padding: 4,
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        margin: 5,
        color: '#181818',
    },
    heartButton: {
        backgroundColor: '#D3CFD4',
        position: "absolute",
        bottom: 10,
        right: 10,
        padding: 5,
        borderRadius: 20,
    }
});

export default Pin;