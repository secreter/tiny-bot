/**
 * Created by pengchaoyang on 2019/1/31
 */
module.exports = async function onRoomTopic (room, topic, oldTopic, changer) {
  console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
}
