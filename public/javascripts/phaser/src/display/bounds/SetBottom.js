/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Positions the Game Object so that the bottom of its bounds aligns with the given coordinate.
 *
 * @function Phaser.Display.Bounds.SetBottom
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject} G - [gameObject,$return]
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that will be re-positioned.
 * @param {number} value - The coordinate to position the Game Object bounds on.
 *
 * @return {Phaser.GameObjects.GameObject} The Game Object that was positioned.
 */
var SetBottom = function (gameObject, value)
{
    gameObject.y = (value - gameObject.height) + (gameObject.height * gameObject.originY);

    return gameObject;
};

module.exports = SetBottom;
