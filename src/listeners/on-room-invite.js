/**
 * Created by pengchaoyang on 2019/1/31
 */
module.exports = async function onRoomInvite (roomInvitation) {
  try {
    console.log(`received room-invite event.`)
    await roomInvitation.accept()
  } catch (e) {
    console.error(e)
  }
}
