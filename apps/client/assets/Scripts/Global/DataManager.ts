import { Node, Prefab, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IBullet, IClientInput, IState, InputTypeEnum } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { JoyStickManager } from "../UI/JoyStickManager";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import EventManager from "./EventManager";
import { EventEnum } from "../Enum";

const ACTOR_SPEED = 100;
const BULLET_SPEED = 600;

const MAP_WIDTH = 960;
const MAP_HEIGHT = 640;

const ACTOR_RADIUS = 50;
const BULLET_RADIUS = 10;

const BULLET_DAMAGE = 5;

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    myPlayerId = 1;

    stage: Node;
    jm: JoyStickManager;
    actorMap: Map<number, ActorManager> = new Map();
    bulletMap: Map<number, BulletManager> = new Map();
    prefabMap: Map<string, Prefab> = new Map();
    textureMap: Map<string, SpriteFrame[]> = new Map();

    state: IState = {
        actors: [
            {
                id: 1,
                hp: 30,
                type: EntityTypeEnum.Actor1,
                weaponType: EntityTypeEnum.Weapon1,
                bulletType: EntityTypeEnum.Bullet2,
                position: {
                    x: -150,
                    y: -150,
                },
                direction: {
                    x: 1,
                    y: 0,
                },
            },
            {
                id: 2,
                hp: 30,
                type: EntityTypeEnum.Actor1,
                weaponType: EntityTypeEnum.Weapon1,
                bulletType: EntityTypeEnum.Bullet2,
                position: {
                    x: 150,
                    y: 150,
                },
                direction: {
                    x: -1,
                    y: 0,
                },
            },
        ],
        bullets: [],
        nextBulletId: 1,
    };

    applyInput(input: IClientInput) {
        switch (input.type) {
            case InputTypeEnum.ActorMove: {
                const {
                    id,
                    dt,
                    direction: { x, y },
                } = input;

                const actor = this.state.actors.find(e => e.id === id);
                actor.direction.x = x;
                actor.direction.y = y;

                actor.position.x += x * dt * ACTOR_SPEED;
                actor.position.y += y * dt * ACTOR_SPEED;

                break;
            }

            case InputTypeEnum.WeaponShoot: {
                const { owner, position, direction } = input;
                const bullet: IBullet = {
                    id: this.state.nextBulletId++,
                    owner,
                    position,
                    direction,
                    type: this.actorMap.get(owner).bulletType,
                };

                EventManager.Instance.emit(EventEnum.BulletBorn, owner);
                this.state.bullets.push(bullet);

                break;
            }

            case InputTypeEnum.TimePast: {
                const { dt } = input;
                const { bullets, actors } = this.state;

                for (let i = bullets.length - 1; i >= 0; i--) {
                    const bullet = bullets[i];

                    if (Math.abs(bullet.position.x) > MAP_WIDTH / 2 || Math.abs(bullet.position.y) > MAP_HEIGHT / 2) {
                        EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, { x: bullet.position.x, y: bullet.position.y });
                        bullets.splice(i, 1);
                        continue;
                    }

                    for (let j = actors.length - 1; j >= 0; j--) {
                        const actor = actors[j];
                        if (
                            (actor.position.x - bullet.position.x) ** 2 + (actor.position.y - bullet.position.y) ** 2 <
                            (ACTOR_RADIUS + BULLET_RADIUS) ** 2
                        ) {
                            actor.hp -= BULLET_DAMAGE;
                            EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, {
                                x: (actor.position.x + bullet.position.x) / 2,
                                y: (actor.position.y + bullet.position.y) / 2,
                            });
                            bullets.splice(i, 1);
                            break;
                        }
                    }
                }

                for (const bullet of bullets) {
                    bullet.position.x += bullet.direction.x * dt * BULLET_SPEED;
                    bullet.position.y += bullet.direction.y * dt * BULLET_SPEED;
                }
            }
        }
    }
}
