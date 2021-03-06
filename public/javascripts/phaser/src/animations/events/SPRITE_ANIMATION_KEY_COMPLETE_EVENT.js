/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Key Complete Event.
 * 
 * This event is dispatched by a Sprite when a specific animation finishes playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationcomplete-key', listener)` where `key` is the key of
 * the animation. For example, if you had an animation with the key 'explode' you should listen for `animationcomplete-explode`.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_KEY_COMPLETE
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation completed on.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation completed.
 */
module.exports = 'animationcomplete-';
