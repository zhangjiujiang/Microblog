import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
actor {
    type Message = {
        content : Text;
        time : Time.Time;
    };

    public type Microblog = actor {
        follow  : shared(Principal) -> async ();
        follows : shared query () -> async [Principal];
        post    : shared(Text) -> async ();
        posts   : shared query (since : Time.Time) -> async [Message];
        timeline: shared () -> async [Message];
    };
    
    stable var followed : List.List<Principal> = List.nil();
    stable var messages : List.List<Message> = List.nil();
    //添加关注
    public shared(msg) func follow(p : Principal) : async () {
        followed := List.push(p,followed);
    };

    //关注列表
    public query(msg) func follows() : async [Principal]{
        List.toArray(followed);
    };
    
    //发布新消息
    public shared(msg) func post(text : Text) : async () {
        assert(Principal.toText(msg.caller)=="6n5we-mxzkz-uc7qa-qdzos-bwol4-upv7n-jxd6a-sbs4v-lehpb-7vbnn-4ae");
        messages := List.push({
            content = text;
            time = Time.now();
        },messages);
    };
    
    //返回所有发布的消息
    public shared query func posts(since : Time.Time) : async [Message] {
        Array.filter<Message>(List.toArray(messages),func(i){i.time >= since});
    };

    //返回所有关注对象发布的消息
    public shared func timeline(since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for (id in Iter.fromList(followed)){
            let canister : Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for (msg in msgs.vals()){
                all := List.push(msg,all);
            }
        };
        List.toArray(all);
    };
};
