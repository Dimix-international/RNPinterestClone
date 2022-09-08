import {RefreshControl, ScrollView, StyleSheet, useWindowDimensions} from "react-native";
import {View} from "./Themed";
import Pin, {PinType} from "./Pin";


type MasonryListType = {
    pins: PinType [],
    refreshing ?: boolean,
    onRefresh: () => void
}

const MasonryList = ({pins, onRefresh, refreshing = false}: MasonryListType) => {

    const width = useWindowDimensions().width;
    const numColumns = Math.ceil(width / 350);

    return (
        <ScrollView
            refreshControl={
                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
            <View style={styles.container}>
                {
                    Array.from(Array(numColumns)).map((_, colIndex) => (
                        <View key={`column_${colIndex}`} style={styles.column}>
                            {
                                pins.filter((_, index:number) => index % numColumns === colIndex)
                                    .map(item => <Pin key={item.id} {...item} />)
                            }
                        </View>
                    ))
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
    },
    column : {
        flex: 1,
    }
});

export default MasonryList;