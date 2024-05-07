import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function myRequestsScreen() {
    const requests = [
        {
            "name": "John Doe",
            "date": "January 1, 2000",
            "complete": false
        },
        {
            "name": "Jane Smith",
            "date": "February 14, 1999",
            "complete": false
        },
        {
            "name": "Michael Brown",
            "date": "March 3, 2010",
            "complete": false
        },
        {
            "name": "Emily Davis",
            "date": "April 12, 2002",
            "complete": false
        },
        {
            "name": "James Wilson",
            "date": "May 25, 2005",
            "complete": false
        },
        {
            "name": "Linda Johnson",
            "date": "June 7, 1997",
            "complete": false
        },
        {
            "name": "Robert Lee",
            "date": "July 19, 2011",
            "complete": false
        },
        {
            "name": "Patricia Clark",
            "date": "August 8, 1996",
            "complete": false
        },
        {
            "name": "David Thompson",
            "date": "September 29, 2003",
            "complete": false
        },
        {
            "name": "Sarah Lewis",
            "date": "October 16, 1998",
            "complete": false
        },
        {
            "name": "Christopher Young",
            "date": "November 11, 2004",
            "complete": false
        },
        {
            "name": "Karen King",
            "date": "December 31, 2012",
            "complete": false
        },
        {
            "name": "Brian White",
            "date": "January 10, 2001",
            "complete": false
        },
        {
            "name": "Nancy Martinez",
            "date": "February 22, 2006",
            "complete": false
        },
        {
            "name": "Daniel Green",
            "date": "March 15, 2009",
            "complete": true
        },
        {
            "name": "Elizabeth Hall",
            "date": "April 25, 1995",
            "complete": false
        },
        {
            "name": "Richard Allen",
            "date": "May 5, 2007",
            "complete": false
        },
        {
            "name": "Jessica Scott",
            "date": "June 30, 1994",
            "complete": false
        },
        {
            "name": "Thomas Adams",
            "date": "July 14, 2014",
            "complete": false
        },
        {
            "name": "Margaret Baker",
            "date": "August 20, 2016",
            "complete": true
        }
    ];

    const renderIcon = (isComplete: boolean) => {
        if (isComplete) return <MaterialIcons name="free-cancellation" size={24} color="black" style={styles.icon} />
        else return <MaterialIcons name="incomplete-circle" size={24} color="black" style={styles.icon} />
    };

    const renderIsComplete = (isComplete: boolean) => {
        if (isComplete) return <Text style={styles.listDate}>Successfully Cancelled</Text>
        else return <Text style={styles.listDate}>Pending</Text>
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={requests}
                renderItem={({ item }) =>
                    <View style={styles.listItem}>
                        <View style={styles.listText}>
                            <Text style={styles.listName}>{item.name}</Text>
                            <Text style={styles.listDate}>{item.date}</Text>
                            {renderIsComplete(item.complete)}
                        </View>
                        {renderIcon(item.complete)}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listText: {
        width: '90%'
    },
    icon: {
        width: "10%"
    },
    listItem: {
        margin: 10,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    list: {
        width: '100%',
    },
    listDate: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    listName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
