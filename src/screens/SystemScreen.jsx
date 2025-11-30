import { StyleSheet, Text, View } from 'react-native';

export default function SystemScreen () {
    return (
        <View style={styles.container}>
            <Text>System Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});