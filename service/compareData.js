export default async function compareData(doc1 , doc2){
    const differences ={
        added:[],
        deleted:[]
    };

    const oldSet = new Set(doc1.map(doc=> JSON.stringify(doc)));
    const newSet = new Set(doc2.map(doc => JSON.stringify(doc)))

    for(const doc of newSet){
        if(!oldSet.has(doc)){
            differences.added.push(JSON.parse(doc))
        }
    }

    for(const doc of oldSet){
        if(!newSet.has(doc)){
            differences.deleted.push(JSON.parse(doc));
        }
    }
    
    return differences;
}