/**
 * Created by pengchaoyang on 2019/1/31
 */
module.exports = async function onRoomJoin (room, leaverList) {
  const nameList = leaverList.map(c => c.name()).join(',')
  console.log(`Room ${room.topic()} lost member ${nameList}`)
}
