import {
  Card,
  Button,
  Description,
  Dropdown,
  Header,
  Kbd,
  Label,
  Separator,
} from "@heroui/react";
import DefImage from "../../assets/download.jpeg";
import Comments from "../Comments/Comments";
import { AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { MdShare } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentCreation } from "../CommentCreation/CommentCreation";
import { BsThreeDots } from "react-icons/bs";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { Pencil, TrashBin } from "@gravity-ui/icons";
import { MdOutlineBookmark } from "react-icons/md";
import { EditModel } from "../EditModel/EditModel";

const PLACEHOLDER_IMAGE = DefImage;

export default function PostCard({ post, isPostDetails = false, className }) {
  const {
    body,
    image,
    topComment,
    id,
    user,
    createdAt,
    bookmarked,
    likesCount,
  } = post;
  const { name, photo } = user;
  const userId = user._id;
  const { userIdLogin } = useContext(AuthContext);
  const query = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isLiked = post?.likes?.includes(userIdLogin);

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments"],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  if (!body && !image) return;

  function deleteMyPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["myProfile"] });
      query.invalidateQueries({ queryKey: ["myPosts"] });
      toast.success("Post Deleted Successfully ✅");
      if (location.pathname.includes("/postdetails/")) {
        navigate(-1);
      }
    },
    onError: () => {
      toast.error("Can't Deleted This Post Now...! ❌");
    },
  });

  function savePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data: savePostUser, mutate: mutateSave } = useMutation({
    mutationFn: savePost,
    onSuccess: () => {
      toast.success(`Saved Post Successfully ✅`, { autoClose: 2000 });
      query.invalidateQueries({ queryKey: ["getSavedPosts"] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: () => {
      toast.error("Can't Save Post Now...! ❌");
    },
  });

  function likePost() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { mutate: likeMutate, error: likeError } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getSavedPosts"] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success(`Liked Post Successfully ✅`, { autoClose: 2000 });
    },
    onError: () => {
      toast.error("Failed to like post. Please try again.", {
        autoClose: 2000,
      });
    },
  });
  return (
    <Card className={className}>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 pb-2">
          <img
            alt="Indie Hackers community"
            className="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
            loading="lazy"
            src={photo}
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />
          <Card.Header>
            <Card.Title>{name}</Card.Title>
            <Card.Description>
              {createdAt
                .split("T")
                .join(" ")
                .split(".")
                .join(" ")
                .split(":")
                .slice(0, 2)
                .join(":")}
            </Card.Description>
          </Card.Header>
        </div>

        <Dropdown>
          <Button isIconOnly aria-label="Menu" variant="secondary">
            <BsThreeDots className="cursor-pointer" />
          </Button>
          <Dropdown.Popover className="min-w-[110px]">
            <Dropdown.Menu>
              <Dropdown.Section>
                <Dropdown.Item
                  id="edit-save"
                  textValue="Save file"
                  onClick={mutateSave}
                >
                  {bookmarked ? (
                    <>
                      <div className="flex items-start justify-center">
                        <MdOutlineBookmark className="size-4 shrink-0 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <Label className="text-blue-600">Un Save</Label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-center">
                        <MdOutlineBookmark className="size-4 shrink-0" />
                      </div>
                      <div className="flex flex-col">
                        <Label>Save</Label>
                      </div>
                    </>
                  )}
                </Dropdown.Item>
              </Dropdown.Section>
              {userId === userIdLogin && (
                <>
                  <Dropdown.Section>
                    <Dropdown.Item
                      closeOnSelect={false}
                      id="edit-file"
                      textValue="Edit file"
                    >
                      <EditModel id={id} body={body} image={image} />
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Section>
                    <Dropdown.Item
                      id="delete-file"
                      textValue="Delete file"
                      variant="danger"
                      onClick={mutate}
                    >
                      <div className="flex items-start justify-center pt-px">
                        <TrashBin className="size-4 shrink-0 text-danger" />
                      </div>
                      <div className="flex flex-col">
                        <Label>Delete</Label>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Section>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
      <Card.Header className="border border-gray-300 rounded-2xl overflow-hidden">
        {body && (
          <Card.Description className="wrap-break-word p-2">
            {body}
          </Card.Description>
        )}
        {image && (
          <Card.Description>
            <img
              className="w-full mt-3 h-100 mx-auto"
              src={image}
              alt={body}
              loading="lazy"
            />
          </Card.Description>
        )}
      </Card.Header>
      <Card.Footer>
        <div className="w-full flex px-2 justify-between items-center pt-2 ">
          <div
            onClick={likeMutate}
            className={`cursor-pointer ${isLiked ? "text-blue-500" : "text-gray-600"} flex gap-1.5 justify-center items-center`}
          >
            <AiFillLike />
            {isLiked ? "Liked " : "Like "}
            {post.likesCount > 0 ? post.likesCount : null}
          </div>
          <Link to={`/postdetails/${id}`}>
            <div className="cursor-pointer flex gap-1.5 justify-center items-center">
              <FaRegCommentDots />
              Comments {post.commentsCount > 0 ? post.commentsCount : null}
            </div>
          </Link>
          <div className="cursor-pointer flex gap-1.5 justify-center items-center">
            <MdShare />
            Share
          </div>
        </div>
      </Card.Footer>
      <CommentCreation
        id={id}
        queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
      />
      {topComment && (
        <Card.Footer>
          <Link className="w-full" to={`/postdetails/${id}`}>
            {isPostDetails === false && <Comments topComment={topComment} />}
            {isPostDetails &&
              data?.data.data.comments.map((currentComment) => (
                <Comments
                  key={currentComment._id}
                  topComment={currentComment}
                />
              ))}
          </Link>
        </Card.Footer>
      )}
    </Card>
  );
}
